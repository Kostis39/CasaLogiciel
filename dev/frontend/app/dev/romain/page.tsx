"use client"
import { useState, useEffect } from "react";

export default function Post({ id }) {
  const [post, setPost] = useState(null);
  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${1}`);
      const data = await response.json();
      setPost(data);
    }
    fetchData();
  }, [id]);
  if (!post) {
    return <p>Loading...</p>;
  }
  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </div>
  );
}