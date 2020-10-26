import app from './app';

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  // eslint-disable-next-line
  console.log(`Server is running on http://localhost:${PORT}/graphiql`);
});
