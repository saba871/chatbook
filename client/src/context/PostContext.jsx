import { useContext, createContext, useState } from 'react';

export const PostContext = createContext();

export const usePost = () => useContext(PostContext);

const API_URL = 'http://localhost:3000/api';
// const API_URL = import.meta.env.VITE_SERVER_URL;
console.log(import.meta.env.VITE_SERVER_URL);
// http://localhost:3000/api

//
export const PostProvider = ({ children }) => {
    const [posts, setPosts] = useState([]);

    const getPosts = async () => {
        try {
            const res = await fetch(`${API_URL}/posts`, {
                credentials: 'include',
            });
            const result = await res.json();
            setPosts(result.data?.posts || []);
        } catch (err) {
            console.error('Error fetching posts:', err);
        }
    };

    const addPost = async (postObj) => {
        try {
            const res = await fetch(`${API_URL}/posts`, {
                method: 'POST',
                body: postObj,
                credentials: 'include',
            });
            const result = await res.json();
            setPosts([...posts, result.data?.post || result]);
        } catch (err) {
            console.error('Error adding post:', err);
        }
    };

    const deletePost = async (id) => {
        try {
            const res = await fetch(`${API_URL}/posts/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            setPosts(posts.filter((post) => post._id != id));

            alert('Post deleted succsesfully');
        } catch (err) {
            console.log(err);
        }
    };

    const updatePost = async (data, postId) => {
        try {
            const res = await fetch(`${API_URL}/posts/${postId}`, {
                method: 'PATCH',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify(data),
                credentials: 'include',
            });

            const result = await res.json();
            const index = posts.findIndex((post) => post._id === postId);
            if (index !== -1) {
                const copyArray = [...posts];
                copyArray.splice(index, 1, result.data?.post || result);
                setPosts(copyArray);
                alert('Post changed');
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <PostContext.Provider
            value={{ getPosts, posts, addPost, deletePost, updatePost }}
        >
            {children}
        </PostContext.Provider>
    );
};

export default PostProvider;
