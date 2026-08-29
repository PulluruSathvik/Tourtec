const key = "BkOTeFDtAryJq5IwLzdXYGCW1EbMhZsfQuS64VljP20ogx7icvv4ZQmWMqBe3KUCGfFSTPyrYJlVd19t";

async function testFast2SMS() {
  console.log("Testing Fast2SMS routes...");
  
  // Test 1: Route 'otp'
  try {
    const res1 = await fetch("https://www.fast2sms.com/dev/bulkV2", {
      method: "POST",
      headers: { "authorization": key, "Content-Type": "application/json" },
      body: JSON.stringify({ route: "otp", variables_values: "9398", numbers: "9618164006" })
    });
    console.log("Route OTP Status:", res1.status);
    console.log("Route OTP Response:", await res1.json());
  } catch (e) {
    console.error("Route OTP Error:", e);
  }

  // Test 2: Route 'q' (Quick SMS)
  try {
    const res2 = await fetch("https://www.fast2sms.com/dev/bulkV2", {
      method: "POST",
      headers: { "authorization": key, "Content-Type": "application/json" },
      body: JSON.stringify({
        route: "q",
        message: "Your TOURTEC verification code is 9398. Valid for 5 mins.",
        language: "english",
        flash: 0,
        numbers: "9618164006"
      })
    });
    console.log("Route Q Status:", res2.status);
    console.log("Route Q Response:", await res2.json());
  } catch (e) {
    console.error("Route Q Error:", e);
  }

  // Test 3: GET endpoint
  try {
    const url = `https://www.fast2sms.com/dev/bulkV2?authorization=${key}&variables_values=9398&route=otp&numbers=9618164006`;
    const res3 = await fetch(url);
    console.log("GET Route OTP Status:", res3.status);
    console.log("GET Route OTP Response:", await res3.json());
  } catch (e) {
    console.error("GET Route OTP Error:", e);
  }
}

testFast2SMS();
