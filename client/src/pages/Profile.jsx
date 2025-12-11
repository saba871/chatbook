import { useAuth } from '../context/AuthContext';
import { usePost } from '../context/PostContext';
import Posts from './Posts';

const Profile = () => {
    const { user } = useAuth();
    const { addPost } = usePost();

    const handleSubmit = (e) => {
        e.preventDefault();

        // const formObj = {
        //     title: e.target.title.value,
        //     content: e.target.content.value,
        //     userId: user._id,
        //     fullname: user.fullname,
        // };

        const formData = new FormData();
        formData.append('title', e.target.title.value);
        formData.append('content', e.target.content.value);
        const file = e.target.postImg.files[0];

        if (file) {
            formData.append('postImg', file);
        }

        addPost(formData);

        e.target.reset();
    };

    return (
        <main>
            <section>
                <h2>My info</h2>
                <p>email: {user.email}</p>
                <p>fullname: {user.fullname}</p>
                <p>Verified: {user.isVerified ? 'no' : 'yes'}</p>
            </section>

            <section>
                <Posts onlyMine={true} />
            </section>

            <section>
                <h2>Add post</h2>
                <form
                    encType="multipart/form-data"
                    // action={'http://localhost:3000' + '/api/posts'}
                    // method="POST"
                    onSubmit={handleSubmit}
                >
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
                    <input type="file" name="postImg" />
                    <button>submit</button>
                </form>
            </section>
        </main>
    );
};

export default Profile;
