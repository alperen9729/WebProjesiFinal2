function planlananlar() {
  console.log("okaayy");
  fetch('/otel-sec', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ user: 'test' })
  });
}