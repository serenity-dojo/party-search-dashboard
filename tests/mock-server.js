// server.js (Example using Express)
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5044;

// Enable CORS
app.use(cors());

app.get('/api/parties', (req, res) => {
    const { query, page = 1, pageSize = 10 } = req.query;

    // Based on the search query, return different responses.
    if (query === 'Acme Corporation') {
        return res.json({
            results: [{
                partyId: "P12345678",
                name: "Acme Corporation",
                type: "Organization",
                sanctionsStatus: "Approved",
                matchScore: "95%"
            }],
            pagination: {
                currentPage: Number(page),
                pageSize: Number(pageSize),
                totalPages: 1,
                totalResults: 1
            }
        });
    } else if (query === 'Acme') {
        return res.json({
            results: [
                {
                    partyId: "P12345678",
                    name: "Acme Corporation",
                    type: "Organization",
                    sanctionsStatus: "Approved",
                    matchScore: "95%"
                },
                {
                    partyId: "P87654321",
                    name: "Acme Inc.",
                    type: "Organization",
                    sanctionsStatus: "Pending Review",
                    matchScore: "65%"
                }
            ],
            pagination: {
                currentPage: Number(page),
                pageSize: Number(pageSize),
                totalPages: 1,
                totalResults: 2
            }
        });
    } else if (query === 'P12345678') {
        return res.json({
            results: [{
                partyId: "P12345678",
                name: "Acme Corporation",
                type: "Organization",
                sanctionsStatus: "Approved",
                matchScore: "95%"
            }],
            pagination: {
                currentPage: Number(page),
                pageSize: Number(pageSize),
                totalPages: 1,
                totalResults: 1
            }
        });
    } else if (query === 'P12345') {
        return res.json({
            results: [{
                partyId: "P12345678",
                name: "Acme Corporation",
                type: "Organization",
                sanctionsStatus: "Approved",
                matchScore: "95%"
            },
            {
                partyId: "P12345999",
                name: "Big Box Corporation",
                type: "Organization",
                sanctionsStatus: "Approved",
                matchScore: "95%"
            },
            {
                partyId: "P12345888",
                name: "Legal Law Firm",
                type: "Organization",
                sanctionsStatus: "Approved",
                matchScore: "95%"
            }

            ],
            pagination: {
                currentPage: Number(page),
                pageSize: Number(pageSize),
                totalPages: 1,
                totalResults: 1
            }
        });
    } else {
        return res.json({
            results: [],
            pagination: {
                currentPage: Number(page),
                pageSize: Number(pageSize),
                totalPages: 0,
                totalResults: 0
            },
            message: `No parties found matching '${query}'`
        });
    }
});

app.listen(port, () => console.log(`API server listening on port ${port}`));
