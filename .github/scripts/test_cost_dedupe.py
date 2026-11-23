"""Tests for cost_dedupe.repeats: which new cost comments repeat an earlier one. No network."""
import importlib
import os
import sys
import unittest

sys.path.insert(0, os.path.dirname(__file__))
d = importlib.import_module("cost_dedupe")  # a module next to this file, without an import after code

REVIEWS = [
    {"id": 1, "body": "Cost review B: 1 Important, 0 Nit, 0 Pre-existing.", "submitted_at": "2026-11-20T10:00:00Z"},
    {"id": 2, "body": "General review: looks fine.", "submitted_at": "2026-11-20T10:05:00Z"},
    {"id": 3, "body": "Cost review B: 1 Important, 0 Nit, 0 Pre-existing.", "submitted_at": "2026-11-21T09:00:00Z"},
    {"id": 4, "body": "Cost review A: 1 Important, 0 Nit, 0 Pre-existing.", "submitted_at": "2026-11-21T09:01:00Z"},
]


def c(cid, review, path="terraform/variables.tf", line=70, reply=None):
    return {"id": cid, "pull_request_review_id": review, "path": path, "line": line, "in_reply_to_id": reply}


class Repeats(unittest.TestCase):
    def test_same_line_again_is_a_repeat(self):
        self.assertEqual(d.repeats([c(10, 1), c(30, 3)], REVIEWS, "B"), [30])

    def test_a_line_or_two_away_is_still_the_same_finding(self):
        self.assertEqual(d.repeats([c(10, 1, line=70), c(30, 3, line=72)], REVIEWS, "B"), [30])
        self.assertEqual(d.repeats([c(10, 1, line=70), c(30, 3, line=75)], REVIEWS, "B"), [])

    def test_other_file_is_new(self):
        self.assertEqual(d.repeats([c(10, 1), c(30, 3, path="main.tf")], REVIEWS, "B"), [])

    def test_outdated_earlier_comment_does_not_suppress(self):
        # The code under the old comment changed, so the new one is about new code.
        self.assertEqual(d.repeats([c(10, 1, line=None), c(30, 3)], REVIEWS, "B"), [])

    def test_general_review_comments_do_not_count(self):
        self.assertEqual(d.repeats([c(20, 2), c(30, 3)], REVIEWS, "B"), [])

    def test_the_other_cost_pass_counts_as_earlier(self):
        # Pass A in review 4 repeats pass B's line from review 3.
        self.assertEqual(d.repeats([c(30, 3), c(40, 4)], REVIEWS, "A"), [40])

    def test_replies_are_never_touched(self):
        self.assertEqual(d.repeats([c(10, 1), c(31, 3, reply=10)], REVIEWS, "B"), [])

    def test_first_review_has_nothing_to_repeat(self):
        self.assertEqual(d.repeats([c(10, 1)], REVIEWS[:2], "B"), [])

    def test_no_cost_review_yet(self):
        self.assertEqual(d.repeats([c(20, 2)], REVIEWS[1:2], "B"), [])


if __name__ == "__main__":
    unittest.main()
