import React from "react";

function App() {
  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      
      <h1>LAN Messenger Dashboard</h1>

      {/* Add Customer Button */}
      <button
        style={{
          backgroundColor: "green",
          color: "white",
          padding: "10px 20px",
          borderRadius: "6px",
          border: "none",
          cursor: "pointer"
        }}
      >
        Add Customer
      </button>

      {/* Customer Form */}
      <form style={{ marginTop: "20px" }}>
        <input
          type="text"
          placeholder="Customer Name"
          style={{ padding: "8px", margin: "5px" }}
        />
        <br />

        <input
          type="email"
          placeholder="Customer Email"
          style={{ padding: "8px", margin: "5px" }}
        />
        <br />

        <button
          type="submit"
          style={{
            backgroundColor: "blue",
            color: "white",
            padding: "8px 16px",
            border: "none",
            borderRadius: "5px"
          }}
        >
          Submit
        </button>
      </form>

    </div>
  );
}

export default App;
