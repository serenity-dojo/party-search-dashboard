Feature: Search for a sanctioned party by name or ID

  Background:
    Given Connie is on the party search page

  Rule: Match parties by full or partial name

    @E2E
    Example: Search by partial name returns all matching parties
      Given the following parties exist:
        | Name             | Type         | Sanctions Status | Match Score  |
        | Acme Corporation | Organization | Approved         |        0.5   |
        | Acme Corp        | Organization | Escalated        |        0.95  |
        | Acme Inc.        | Organization | PendingReview    |        0.625 |
        | Axe Capital      | Organization | Escalated        |        0.85  |
      When Connie searches for "Acme"
      Then the search results should contain exactly:
        | Name             | Type         | Sanctions Status | Match Score   |
        | Acme Corp        | Organization | Escalated        |         95%   |
        | Acme Corporation | Organization | Approved         |         50%   |
        | Acme Inc.        | Organization | Pending Review   |         62.5% |

  Rule: Filter results by sanction Status
     
      @E2E
      Example: Filter by Sanction Status
        Given the following parties exist:
          | Name             | Type          | Sanctions Status | Match Score  |
          | Tech Corporation | Organization  | Approved         |        0.5   |
          | Tech Corp        | Organization  | ConfirmedMatch   |        0.95  |
          | Tech Inc.        | Organization  | PendingReview    |        0.625 |
          | Tech Capital      | Organization | Escalated        |        0.85  |
        When Connie searches for "Tech"
        And Connie filters by sanction status "Confirmed Match"
        Then the search results should contain exactly:
          | Name             | Type          | Sanctions Status   | Match Score   |
          | Tech Corp        | Organization  | Confirmed Match    |         95%   |