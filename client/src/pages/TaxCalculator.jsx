import React from "react";

const TaxCalculator = () => {
  return (
    <div style={{ height: "600px", width: "100%" }}>
      <iframe
        src="https://payetax.netlify.app/#google_vignette"
        title="Tax Calculator"
        style={{ border: "none", width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default TaxCalculator;
