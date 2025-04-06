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
