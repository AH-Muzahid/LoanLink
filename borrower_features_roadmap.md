# Borrower Features Implementation Roadmap

This document outlines the implementation plan for enhancing the Borrower experience in the LoanLinks dashboard, as requested.

## 🚀 Priority 1: Loan Application Status Tracker (Visual Timeline)

**Objective:** Upgrade the current `StatusTimeline` to provide a granular, "pizza-tracker" style view of the loan lifecycle: `Applied` -> `Under Review` -> `Document Verified` -> `Approved` -> `Disbursed`.

### Implementation Steps:
1.  **Modify `StatusTimeline.jsx` Component:**
    *   Update the `steps` array to include:
        *   **Applied:** (Standard)
        *   **Under Review:** (Standard)
        *   **Document Verified:** (New - *Note: Backend might need to provide this specific status. For now, we can infer it if decision is made or approved.*)
        *   **Approved/Rejected:** (Standard)
        *   **Disbursed:** (New - *Note: Requires a 'disbursed' status or flag from backend. Can infer if `status === 'approved'` and `feeStatus === 'paid'` for now, or add a specific admin action.*)
    *   **Logic Update:** precise logic to light up steps based on `loan.status` and `loan.feeStatus`.

2.  **Integration:**
    *   Ensure `LoanDetailsModal` passes all necessary data (`status`, `feeStatus`, and potentially `fulfillmentStatus` if available) to the timeline.

## 💰 Priority 2: Payment History & Professional Receipts (PDF)

**Objective:** Allow users to download professional PDF receipts for their payments.

### Implementation Steps:
1.  **Install Dependencies:**
    *   `npm install jspdf html2canvas`
2.  **Update `PaymentReceiptModal.jsx`:**
    *   **Design:** Style the receipt content to look professional (borders, logo header, clear typography) - resembling a real paper invoice.
    *   **Functionality:** Add a "Download PDF" button.
    *   **Logic:** Use `html2canvas` to capture the receipt element and `jspdf` to generate the downloadable file.
3.  **Payment History List (MyLoans Page):**
    *   *Optional but recommended:* Create a separate "Payment History" tab or modal that lists *all* past payments, not just the one associated with a specific loan view.

## 📅 Priority 3: Repayment Schedule (EMI Calendar)

**Objective:** Show the user their upcoming payment obligations.

### Implementation Steps:
1.  **New Component: `RepaymentSchedule.jsx`:**
    *   **Input:** Loan Amount, Interest Rate, Duration (Months), Start Date.
    *   **Calculation:** Use standard EMI formula to calculate monthly payments.
    *   **Output:** A table showing: `Date`, `Installment Amount`, `Principal`, `Interest`, `Remaining Balance`.
2.  **Dashboard Integration:**
    *   Add a "Repayment Schedule" button in the `LoanDetailsModal`.
    *   Or add a dedicated "Repayments" card in the dashboard home.
3.  **Alerts:**
    *   Calculate the *next* payment date based on the loan approval date + 1 month.
    *   Show a prominent warning/alert if the date is within 3 days.

## 🌟 Advanced Features (Brief Overview)

4.  **Profile Verification Badge:**
    *   Add `isVerified` field to User model (Backend).
    *   Add UI for document upload (Frontend).
    *   Show Badge in Navbar/Sidebar.

5.  **Personalized Loan Calculator:**
    *   Create `LoanCalculator` component in `src/Components/Dashboard/Borrower/`.
    *   Allow input of Amount & Duration.
    *   Display: Monthly EMI, Total Interest, Total Payable.

6.  **Support/Direct Chat:**
    *   Simplest: Integrate Tawk.to or similar script in `index.html`.
    *   Custom: Build a real-time chat using Socket.io (complex).

7.  **Savings/Investment Warning:**
    *   Calculate `Total Loan Amount` / `Reported Income`.
    *   If ratio > 40-50%, show a warning banner in `ApplyLoan` or Dashboard.

---

**Immediate Action Item:**
The developer is ready to implement **Priority 1 (Timeline)** and **Priority 2 (Receipts)** immediately.
