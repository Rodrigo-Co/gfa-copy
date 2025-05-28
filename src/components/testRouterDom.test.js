jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}));

test('react-router-dom mock deve funcionar', () => {
  const { useNavigate } = require('react-router-dom');
  expect(useNavigate).toBeDefined();
});
