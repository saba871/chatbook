import { useEffect, useState } from 'react';
import { usePost } from '../context/PostContext';
import { useAuth } from '../context/AuthContext';

const Posts = ({ onlyMine = false }) => {
    const { posts, getPosts, deletePost, updatePost } = usePost();
    const { user } = useAuth();

    const [editingPostId, setEditingPostId] = useState(null);

    const handleSubmit = (e, postId) => {
        e.preventDefault();
        const data = {
            title: e.target.title.value,
            content: e.target.content.value,
        };
        setEditingPostId(null);
        updatePost(data, postId);
    };

    useEffect(() => {
        getPosts();
    }, []);

    const filteredPosts = onlyMine
        ? posts.filter((post) => post.userId === user._id)
        : posts;

    return (
        <div>
            <h1>{onlyMine ? 'My Posts' : 'All Posts'}</h1>

            <ul>
                {!filteredPosts || filteredPosts.length === 0 ? (
                    <p>No Posts Found!</p>
                ) : (
                    filteredPosts.map((post) => (
                        <li key={post._id}>
                            <p>Created By: {post.fullname}</p>

                            {editingPostId === post._id ? (
                                <form
                                    onSubmit={(e) => handleSubmit(e, post._id)}
                                >
                                    <div>
                                        <label htmlFor="title">
                                            Post Title
                                        </label>
                                        <input
                                            id="title"
                                            type="text"
                                            name="title"
                                            placeholder={post.title}
                                            required
                                        />
                                        <br />
                                        <br />
                                    </div>

                                    <div>
                                        <label htmlFor="content">
                                            Post Content
                                        </label>
                                        <br />
                                        <textarea
                                            id="content"
                                            name="content"
                                            placeholder={post.content}
                                            required
                                        />
                                        <br />
                                        <br />
                                    </div>

                                    <button>Submit</button>
                                    <button
                                        type="button"
                                        onClick={() => setEditingPostId(null)}
                                    >
                                        Cancel
                                    </button>
                                </form>
                            ) : (
                                <>
                                    <h3>{post.title}</h3>
                                    <p>Content: {post.content}</p>

                                    {user &&
                                        post.userId === user._id &&
                                        onlyMine && (
                                            <button
                                                onClick={() =>
                                                    deletePost(post._id)
                                                }
                                            >
                                                Delete Post
                                            </button>
                                        )}
                                    <button
                                        onClick={() =>
                                            setEditingPostId(post._id)
                                        }
                                    >
                                        Update
                                    </button>
                                </>
                            )}
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default Posts;
