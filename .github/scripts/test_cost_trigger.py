"""Tests for cost_trigger.decide: which cost pass a PR's changed files start. No network."""
import importlib
import os
import sys
import unittest

sys.path.insert(0, os.path.dirname(__file__))
t = importlib.import_module("cost_trigger")  # a module next to this file, without an import after code


def passes(files):
    w = t.decide(files)
    return {k for k in ("A", "B") if w[k]}


class Decide(unittest.TestCase):
    def test_firestore_query_starts_a(self):
        self.assertEqual(passes([("src/lib/catalog.ts", "const s = await db.collection('assets').where('x', '==', 1).get()")]), {"A"})

    def test_deploy_config_starts_a_by_path(self):
        self.assertEqual(passes([("cloudbuild.yaml", "--concurrency 10")]), {"A"})
        self.assertEqual(passes([("terraform/cloud_run.tf", "min_instance_count = 2")]), {"A"})

    def test_skill_file_starts_b_by_path(self):
        self.assertEqual(passes([("plugins/x/skills/audit/SKILL.md", "Write this block verbatim to a temp file")]), {"B"})

    def test_model_call_anywhere_starts_b(self):
        self.assertEqual(passes([("web/lib/news.ts", "import { GoogleGenAI } from '@google/genai'")]), {"B"})

    def test_both(self):
        self.assertEqual(passes([("web/lib/a.ts", "db.collection('x')"), ("web/lib/b.ts", "ai.models.generateContent(req)")]), {"A", "B"})

    def test_prose_never_matches_on_content(self):
        self.assertEqual(passes([("docs/notes.md", "we call anthropic and .where( and bigquery")]), set())

    def test_model_name_in_config_does_not_start_b(self):
        self.assertEqual(passes([("deploy/values.yaml", "MODEL: gemini-3.8-flash")]), set())

    def test_report_client_starts_a(self):
        self.assertEqual(passes([("src/providers/eks.ts", "const r = await this.cloudAnalyticsClient.getReport({})")]), {"A"})

    def test_temp_function_starts_a(self):
        self.assertEqual(passes([("server/queries.go", "CREATE TEMP FUNCTION key(labels ANY TYPE) AS (1);")]), {"A"})

    def test_function_handler_starts_a_by_path(self):
        self.assertEqual(passes([("firebase/functions/v1/auditLogsWatcher.ts", "if (process.env._DEBUGGING === '1') {")]), {"A"})

    def test_storage_call_starts_a(self):
        self.assertEqual(passes([("src/lib/cache.ts", "const [files] = await storage.bucket(name).getFiles({ prefix })")]), {"A"})

    def test_gemini_md_starts_b_by_path(self):
        self.assertEqual(passes([("GEMINI.md", "Always load the full schema reference before answering.")]), {"B"})

    def test_ui_only_starts_nothing(self):
        self.assertEqual(passes([("web/app/date-picker.tsx", "<button className='px-2'>Today</button>")]), set())

    def test_lockfiles_and_tests_are_skipped(self):
        self.assertEqual(passes([("pnpm-lock.yaml", "bigquery"), ("web/lib/a.test.ts", "db.collection('x')")]), set())

    # From the rollout PRs' reviews (2026-11-09): repo layouts the first version missed.
    def test_go_pascal_case_sdk_calls_start_a(self):
        self.assertEqual(passes([("internal/sync/run.go", 'iter := client.Collection("tickets").Where("open", "==", true).Documents(ctx)')]), {"A"})
        self.assertEqual(passes([("internal/blob/put.go", 'w := client.Bucket(name).Object(key).NewWriter(ctx)')]), {"A"})

    def test_go_handler_and_repository_start_a_by_path(self):
        self.assertEqual(passes([("internal/handler/users.go", "func List(w http.ResponseWriter) {")]), {"A"})
        self.assertEqual(passes([("internal/repository/tickets.go", "return r.rows, nil")]), {"A"})
        self.assertEqual(passes([("internal/middleware/ratelimit.go", "limit := 10")]), {"A"})

    def test_sql_in_code_starts_a(self):
        self.assertEqual(passes([("internal/store/t.go", 'rows, err := db.pool.Query(ctx, "SELECT id, name FROM templates.ticket_templates")')]), {"A"})
        self.assertEqual(passes([("recon/signals.py", "resp = client.run_query(request={'structured_query': q})")]), {"A"})

    def test_root_level_globs_match(self):
        self.assertEqual(passes([("schema.sql", "alter table x add column y int")]), {"A"})
        self.assertEqual(passes([("billing_agent/tools.py", "def lookup(): pass")]), {"B"})

    def test_deploy_variants_start_a_by_path(self):
        self.assertEqual(passes([("recon/Dockerfile.recon", "FROM python:3.12")]), {"A"})
        self.assertEqual(passes([("environments/prod/terraform.tfvars", 'db_tier = "db-custom-2"')]), {"A"})
        self.assertEqual(passes([("service.template.yaml", "autoscaling.knative.dev/minScale: '1'")]), {"A"})

    def test_service_glob_stays_inside_one_segment(self):
        self.assertEqual(passes([("web/services/billing/labels.yaml", "title: Billing")]), set())

    def test_agent_prompt_files_start_b_by_path(self):
        self.assertEqual(passes([("adk/app/system-instruction.md", "You are a helpful wish triage assistant.")]), {"B"})
        self.assertEqual(passes([("app/agent.py", "RANK_INSTRUCTION = 'Rank the accounts.'")]), {"B"})
        self.assertEqual(passes([("routing-agent/app/intent.py", "LABELS = ['billing']")]), {"B"})
        self.assertEqual(passes([(".agents/workflows/release.md", "Run the release checklist.")]), {"B"})

    def test_python_tests_e2e_and_tf_lock_are_skipped(self):
        self.assertEqual(passes([(".github/scripts/test_cost_trigger.py", "db.collection('assets').where(1)"),
                                 ("e2e/sourcing.spec.ts", "db.collection('x')"),
                                 ("terraform/.terraform.lock.hcl", 'provider "google" {}')]), set())

    def test_select_distinct_and_nested_terraform_start_a(self):
        self.assertEqual(passes([("web/lib/ar.ts", "const q = `SELECT DISTINCT customer_id FROM ar.invoices`")]), {"A"})
        self.assertEqual(passes([("svc/deployment/terraform/README", "apply with -var-file")]), {"A"})
        self.assertEqual(passes([("templates/env/terraform.tfvars.tmpl", 'db_tier = "{{ .Tier }}"')]), {"A"})

    def test_conversational_analytics_and_thinking_settings_start_b(self):
        self.assertEqual(passes([("slack-bot/answer.py", 'body = {"thinkingMode": "FAST"}')]), {"B"})
        self.assertEqual(passes([("web/lib/ask.ts", "const c = new DataChatServiceClient() // geminidataanalytics")]), {"B"})

    def test_agent_source_files_start_b_by_path(self):
        self.assertEqual(passes([("src/adk-agent.ts", "export const run = () => {}")]), {"B"})


class ExtraPaths(unittest.TestCase):
    def test_repo_extra_paths_add_to_the_shared_ones(self):
        extra = t.extra_paths("# analyst: rules decide the context of every question\nB rules/**\nA web/lib/ar.ts\n")
        self.assertEqual(extra, {"A": ["web/lib/ar.ts"], "B": ["rules/**"]})
        w = t.decide([("rules/notes/revenue.md", "Revenue is net of credits.")], extra)
        self.assertTrue(w["B"])
        self.assertFalse(w["A"])
        self.assertFalse(t.decide([("rules/notes/revenue.md", "Revenue is net of credits.")])["B"])

    def test_bad_line_is_refused(self):
        with self.assertRaises(SystemExit):
            t.extra_paths("rules/**")


if __name__ == "__main__":
    unittest.main()
