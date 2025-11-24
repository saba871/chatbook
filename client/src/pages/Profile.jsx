import { useAuth } from '../context/AuthContext';
import { usePost } from '../context/PostContext';
import Posts from './Posts';

const Profile = () => {
    const { user } = useAuth();
    const { addPost } = usePost();

    const handleSubmit = (e) => {
        e.preventDefault();

        const formObj = {
            title: e.target.title.value,
            content: e.target.content.value,
            userId: user._id,
            fullname: user.fullname,
        };

        addPost(formObj);
    };

    return (
        <main>
            <section>
                <h2>My info</h2>
                <p>email: {user.email}</p>
                <p>fullname: {user.fullname}</p>
                <p>Verified: {user.isVerified ? 'yes' : 'no'}</p>
            </section>

            <section>
                <Posts onlyMine={true} />
            </section>

            <section>
                <h2>Add post</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="title"
                        placeholder="title"
                        required
                    />
                    <input
                        type="text"
                        name="content"
                        placeholder="content"
                        required
                    />
                    <button>submit</button>
                </form>
            </section>
        </main>
    );
};

export default Profile;
