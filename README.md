# Sales Conversion Assistant Dashboard

A full-stack web application to help sales teams optimize their conversion process, analyze sales data, and generate actionable insights using AI and data visualization.

---

## Features

- **User Authentication:** Simple login for sales team members.
- **Sales Dashboard:** Visualize sales performance and trends.
- **AI Insights:** Get top-performing products and common objections using AI.
- **Proposal Generator:** Generate sales proposals based on customer requirements.
- **Objection Handler:** Get suggested responses to common sales objections.
- **Customer Management:** View and manage customer details and interactions.
- **ERP Integration:** Fetch product and sales data from Business Central ERP.

---

## Tech Stack

- **Frontend:** React, Material-UI, Recharts, Axios
- **Backend:** FastAPI, Python, Pydantic, LangChain, scikit-learn
- **AI Integration:** Google Gemini API (via LangChain)
- **ERP Integration:** Microsoft Dynamics 365 Business Central (OData)
- **Authentication:** Simple demo authentication (can be extended)

---

## Getting Started

### Prerequisites

- Node.js (v16+)
- Python 3.8+
- pip
- npm
- Access to Business Central ERP (for live data)
- Google Gemini API Key (for AI features)

---

### 1. Clone the Repository

```sh
git clone https://github.com/lizpart/Dashboard.git
cd sales-assistant
```

---

### 2. Backend Setup

```sh
cd backend
python -m venv venv
venv\Scripts\activate  # On Windows
pip install -r requirements.txt
```

Create a `.env` file in the `backend` folder with your credentials:

```
BC_ERP_URL=your_erp_url
BC_ERP_USERNAME=your_erp_username
BC_ERP_PASSWORD=your_erp_password
GEMINI_API_KEY=your_gemini_api_key
```

Start the backend server:

```sh
uvicorn app:app --reload
```

---

### 3. Frontend Setup

```sh
cd ../sales-assistant
npm install
npm start
```

The frontend will run at [http://localhost:3000](http://localhost:3000).

---

## Usage

1. Open [http://localhost:3000](http://localhost:3000) in your browser.
2. Login with the demo credentials:
   - **Username:** `sales`
   - **Password:** `password`
3. Explore the dashboard, insights, proposal generator, and objection handler.

---

## Project Structure

```
sales-assistant/
│
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   └── ...
│
├── sales-assistant/
│   ├── src/
│   │   ├── components/
│   │   ├── App.js
│   │   └── ...
│   ├── package.json
│   └── ...
│
└── README.md
```

---

## Customization

- **Authentication:** Replace demo login with real authentication as needed.
- **ERP Integration:** Update endpoints and credentials for your ERP system.
- **AI Integration:** Use your own Gemini API key for AI-powered features.

---

## License

MIT License

---

## Acknowledgements

- [FastAPI](https://fastapi.tiangolo.com/)
- [React](https://react.dev/)
- [Material-UI](https://mui.com/)
- [Recharts](https://recharts.org/)
- [LangChain](https://python.langchain.com/)
- [Google Gemini API](https://ai.google.dev/)

---

**For questions or contributions, please open an issue or pull request!**
