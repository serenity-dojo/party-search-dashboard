Feature: Search for a party by name or ID

  Background:
    Given Connie is on the party search page

  Rule: Match parties by full or partial name

    Example: Search by full name returns an exact match
      Given the Party API returns the following parties for the search query "Acme Corporation":
        | Party ID  | Name             | Type         | Sanctions Status | Match Score |
        | P12345678 | Acme Corporation | Organization | Approved         |         95% |
      When Connie searches for "Acme Corporation"
      Then the search results should contain exactly:
        | Party ID  | Name             | Type         | Sanctions Status | Match Score |
        | P12345678 | Acme Corporation | Organization | Approved         |         95% |

    Example: Search by partial name returns all matching individuals
      Given the Party API returns the following parties for the search query "Smith":
        | Party ID  | Name             | Type       | Sanctions Status | Match Score |
        | P12345678 | John Smith       | Individual | Approved         |         90% |
        | P87654321 | Jane Smith       | Individual | Pending Review   |         85% |
        | P87654329 | Smith Johnson    | Individual | Escalated        |         80% |
        | P87654339 | Sarah-Jane Smith | Individual | False Positive   |         80% |
      When Connie searches for "Smith"
      Then the search results should contain exactly:
        | Party ID  | Name             | Type       | Sanctions Status | Match Score |
        | P12345678 | John Smith       | Individual | Approved         |         90% |
        | P87654321 | Jane Smith       | Individual | Pending Review   |         85% |
        | P87654329 | Smith Johnson    | Individual | Escalated        |         80% |
        | P87654339 | Sarah-Jane Smith | Individual | False Positive   |         80% |

    Example: Search by ID returns the correct party
      Given the Party API returns the following parties for the search query "P12345678":
        | Party ID  | Name             | Type         | Sanctions Status | Match Score |
        | P12345678 | Acme Corporation | Organization | Approved         |         95% |
      When Connie searches for "P12345678"
      Then the search results should contain exactly:
        | Party ID  | Name             | Type         | Sanctions Status | Match Score |
        | P12345678 | Acme Corporation | Organization | Approved         |         95% |

    Example: Search for an unknown ID returns no results
      Given the Party API returns no parties for the search query "XYZ"
      When Connie searches for "XYZ"
      And Connie should see a message: "No parties found matching 'XYZ'"
    # API Scenarios:
    #
    # Example: Search by full name returns an exact match
    #   # Connie is a compliance officer responsible for reviewing third-party relationships.
    #   Given the following parties exist:
    #     | Party ID  | Name             | Type         | Sanctions Status | Match Score |
    #     | P12345678 | Acme Corporation | Organization | Approved         |         95% |
    #     | P87654321 | Axel Accounting  | Organization | Pending Review   |         70% |
    #     | P87654329 | Axe Capital      | Organization | Escalated        |         85% |
    #   When Connie searches for "Acme Corporation"
    #   Then the search results should contain exactly:
    #     | Party ID  | Name             | Type         | Sanctions Status | Match Score |
    #     | P12345678 | Acme Corporation | Organization | Approved         |         95% |
    # Example: Search by partial name returns all matching parties
    #   Given the following parties exist:
    #     | Party ID  | Name             | Type         | Sanctions Status | Match Score |
    #     | P12345678 | Acme Corporation | Organization | Approved         |         95% |
    #     | P87654321 | Acme Inc.        | Organization | Pending Review   |         65% |
    #     | P87654329 | Axe Capital      | Organization | Escalated        |         85% |
    #   When Connie searches for "Acme"
    #   Then the search results should contain exactly:
    #     | Party ID  | Name             | Type         | Sanctions Status | Match Score |
    #     | P12345678 | Acme Corporation | Organization | Approved         |         95% |
    #     | P87654321 | Acme Inc.        | Organization | Pending Review   |         65% |
    # Example: Search by ID returns the correct party
    #   Given the following parties exist:
    #     | Party ID  | Name             | Type         | Sanctions Status | Match Score |
    #     | P12345678 | Acme Corporation | Organization | Approved         |         95% |
    #     | P87654329 | Axe Capital      | Organization | Escalated        |         85% |
    #   When Connie searches for "P12345678"
    #   Then the search results should contain exactly:
    #     | Party ID  | Name             | Type         | Sanctions Status | Match Score |
    #     | P12345678 | Acme Corporation | Organization | Approved         |         95% |
    # Example: Search for an unknown ID returns no results
    #   Given the following parties exist:
    #     | Party ID  | Name             | Type         | Sanctions Status | Match Score |
    #     | P12345678 | Acme Corporation | Organization | Approved         |         95% |
    #   When Connie searches for "XYZ"
    #   Then the search results should be empty
    #   And Connie should see a message: "No parties found matching 'XYZ'"
  # Rule: Searches should be case-insensitive
  #   Example: The one where Connie searches for "acme corporation"
  #     Given the Party API returns the following parties for the search query "acme corporation":
  #       | Party ID  | Name             | Type         | Sanctions Status | Match Score |
  #       | P12345678 | Acme Corporation | Organization | Approved         |         95% |
  #     When Connie searches for "acme corporation"
  #     Then the search results should contain exactly:
  #       | Party ID  | Name             | Type         | Sanctions Status | Match Score |
  #       | P12345678 | Acme Corporation | Organization | Approved         |         95% |
