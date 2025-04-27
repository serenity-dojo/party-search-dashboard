Feature: Search for a party by name or ID

  Rule: Match parties by full or partial name

    @UI
    Example: Search by full name returns an exact match
      Given the Party API returns the following parties for the search query "Acme Corporation":
        | Party ID  | Name             | Type         | Sanctions Status | Match Score |
        | P12345678 | Acme Corporation | Organization | Approved         |        0.95 |
      And Connie is on the party search page
      When Connie searches for "Acme Corporation"
      Then the search results should contain exactly:
        | Party ID  | Name             | Type         | Sanctions Status | Match Score |
        | P12345678 | Acme Corporation | Organization | Approved         |         95% |

    @UI
    Example: Search by partial name returns all matching individuals
      Given the Party API returns the following parties for the search query "Smith":
        | Party ID  | Name             | Type       | Sanctions Status | Match Score |
        | P12345678 | John Smith       | Individual | Approved         |        0.90 |
        | P87654321 | Jane Smith       | Individual | Pending Review   |        0.85 |
        | P87654329 | Smith Johnson    | Individual | Escalated        |        0.80 |
        | P87654339 | Sarah-Jane Smith | Individual | False Positive   |        0.80 |
      And Connie is on the party search page
      When Connie searches for "Smith"
      Then the search results should contain exactly:
        | Party ID  | Name             | Type       | Sanctions Status | Match Score |
        | P12345678 | John Smith       | Individual | Approved         |         90% |
        | P87654321 | Jane Smith       | Individual | Pending Review   |         85% |
        | P87654329 | Smith Johnson    | Individual | Escalated        |         80% |
        | P87654339 | Sarah-Jane Smith | Individual | False Positive   |         80% |

    @UI
    Example: Search by ID returns the correct party
      Given the Party API returns the following parties for the search query "P12345678":
        | Party ID  | Name             | Type         | Sanctions Status | Match Score |
        | P12345678 | Acme Corporation | Organization | Approved         |        0.95 |
      And Connie is on the party search page
      When Connie searches for "P12345678"
      Then the search results should contain exactly:
        | Party ID  | Name             | Type         | Sanctions Status | Match Score |
        | P12345678 | Acme Corporation | Organization | Approved         |         95% |

    @UI
    Example: Search for an unknown ID returns no results
      Given the Party API returns no parties for the search query "XYZ"
      And Connie is on the party search page
      When Connie searches for "XYZ"
      And Connie should see a message: "No parties found matching 'XYZ'"

  Rule: When 3 letters are entered matching parties are suggested

    @UI
    Example: Search by partial name returns all matching individuals
      Given the Party API returns the following parties for the search query "Joh":
        | Party ID  | Name          | Type       | Sanctions Status | Match Score |
        | P12345678 | John Smith    | Individual | Approved         |         0.90 |
        | P87654329 | Smith Johnson | Individual | Escalated        |         0.80 |
      And Connie is on the party search page
      When Connie types "Joh"
      Then the following names should be suggested:
        | John Smith    |
        | Smith Johnson |

    @UI
    Example: No auto-suggestions with fewer than three letters
      Given the Party API returns the following parties for the search query "Ac":
        | Party ID  | Name          | Type       | Sanctions Status | Match Score |
        | P12345678 | John Smith    | Individual | Approved         |         0.90 |
        | P87654329 | Smith Johnson | Individual | Escalated        |         0.80 |
      And Connie is on the party search page
      When Connie types "Ac"
      Then no names should be suggested

    @UI
    Example: Should propose auto-suggestions for party ID with 5 characters or more
      Given the Party API returns the following parties for the search query "P1234":
        | Party ID  | Name          | Type       | Sanctions Status | Match Score  |
        | P12345678 | John Smith    | Individual | Approved         |         0.90 |
        | P12344329 | Smith Johnson | Individual | Escalated        |         0.80 |
      And Connie is on the party search page
      When Connie types "P1234"
      Then the following names should be suggested:
        | John Smith |
        | Smith Johnson |
