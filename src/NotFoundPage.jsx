import {Link} from 'react-router-dom';

export default function NotFoundPage() {
    return (
        <div>
            <p className="input-email">404 Not Found</p>
            <Link className="error logout-btn">Back</Link>
        </div>
    );
};