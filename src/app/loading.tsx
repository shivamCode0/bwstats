import { Spinner } from 'react-bootstrap';

export default function Loading() {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
      <div className="text-center">
        <Spinner animation="border" role="status" variant="primary" className="mb-3" />
        <p>Loading...</p>
      </div>
    </div>
  );
}
