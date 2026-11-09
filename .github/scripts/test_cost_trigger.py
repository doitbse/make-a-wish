"""Tests for cost_trigger.decide: which cost pass a PR's changed files start. No network."""
import os
import sys
import unittest

sys.path.insert(0, os.path.dirname(__file__))
import cost_trigger as t  # noqa: E402


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


if __name__ == "__main__":
    unittest.main()
