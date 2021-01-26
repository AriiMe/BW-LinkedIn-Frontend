try {
  const response = await fetch(
    "https://linkedin-bw-clone.herokuapp.com/api/profile"
  );
  if (response.ok) {
    let data = await response.json();
    console.log(data);
  }
} catch (error) {
  console.log(error);
}
