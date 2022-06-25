import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import PostService from "../API/PostService";
import { Loader } from "../components/UI/loader/Loader";
import { useFetching } from "../components/hooks/useFetching";

const PostIdPage = () => {
	const params = useParams();
	const [post, setPost] = useState({});
	const [comments, setComments] = useState([]);
	const [fetchPostById, isLoading, error] = useFetching(async () => {
		const response = await PostService.getById(params.id);
		setPost(response.data);
	});
	const [fetchComments, isComLoading, comerror] = useFetching(async () => {
		const response = await PostService.getCommentsByPostId(params.id);
		setComments(response.data);
	});

	useEffect(() => {
		fetchPostById();
		fetchComments();
	}, []);

	return (
		<div>
			<h1>Вы открыли страницу поста с ID = {params.id}</h1>
			{isLoading ? (
				<Loader />
			) : (
				<div>
					{post.id}. {post.title}
				</div>
			)}
			<h1>Comments</h1>
			{isComLoading ? (
				<Loader />
			) : (
				<div>
					{comments.map((comm) => (
						<div key={comm.id} style={{ marginTop: "15px" }}>
							<h5>{comm.email}</h5>
							<div>{comm.body}</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default PostIdPage;
