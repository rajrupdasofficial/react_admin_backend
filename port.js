function serverport(){
    const PORT = 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  }
  
  module.exports = serverport; // Remove the parentheses after serverport
  