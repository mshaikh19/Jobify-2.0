import re

with open('d:/Studies/DAU/SEM 3/IT643/Project/Jobify/frontend/src/pages/AuthPage.jsx', 'r') as f:
    content = f.read()

old = """  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setTimeout(() => {
      setLoading(false);
      setMessage(
        `Successfully authenticated as ${role === "job_seeker" ? "Candidate" : "Employer"}!`
      );
      setTimeout(() => {
        onLoginSuccess({
          email,
          full_name: role === "job_seeker" ? fullName : "Talent Director",
          role: role,
          company_name: role === "employer" ? companyName : null,
        });
      }, 700);
    }, 800);
  };"""

new = """  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      let response;

      if (authMode === "signup") {
        // Register new user
        response = await api.post("/api/v1/auth/register", {
          email,
          password,
          full_name: fullName,
          role: role,
          company_name: role === "employer" ? companyName : undefined,
          phone: undefined,
        });
      } else {
        // Login with JSON body
        response = await api.post("/api/v1/auth/json-login", {
          email,
          password,
        });
      }

      // Store token and user in localStorage
      const token = response.data.access_token;
      const userData = response.data;

      localStorage.setItem("jobify_token", token);
      localStorage.setItem("jobify_user", JSON.stringify({
        ...userData,
        id: userData.id || userData._id,
      }));

      setMessage(
        `Successfully authenticated as ${role === "job_seeker" ? "Candidate" : "Employer"}!`
      );

      // Call parent callback with real user data
      setTimeout(() => {
        onLoginSuccess({
          email,
          full_name: role === "job_seeker" ? fullName : "Talent Director",
          role: role,
          company_name: role === "employer" ? companyName : null,
        });
      }, 700);

    } catch (error) {
      // Show error message from backend
      const errorMsg = error.response?.data?.detail || "Authentication failed";
      setMessage(errorMsg);
      console.error("Auth error:", error);
    } finally {
      setLoading(false);
    }
  };"""

if old in content:
    content = content.replace(old, new)
    with open('d:/Studies/DAU/SEM 3/IT643/Project/Jobify/frontend/src/pages/AuthPage.jsx', 'w') as f:
        f.write(content)
    print("Replacement successful")
else:
    print("Old text not found")
    # Show what handleSubmit looks like
    match = re.search(r'const handleSubmit.*?;\\s*;', content, re.DOTALL)
    if match:
        print("Found handleSubmit:")
        print(match.group()[:500])