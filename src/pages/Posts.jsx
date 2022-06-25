import { useEffect, useState, useRef } from "react";
import PostService from "../API/PostService";
import { useFetching } from "../components/hooks/useFetching";
import { useObserver } from "../components/hooks/useObserver";
import { usePosts } from "../components/hooks/usePosts";
import PostFilter from "../components/PostFilter";
import PostForm from "../components/PostForm";
import PostList from "../components/PostList";
import MyButton from "../components/UI/button/MyButton";
import { Loader } from "../components/UI/loader/Loader";
import MyModal from "../components/UI/MyModal/MyModal";
import { Pagination } from "../components/UI/pagination/Pagination";
import MySelect from "../components/UI/select/MySelect";
import "../styles/App.css";
import { getPagesCount } from "../utils/pages";

function Posts() {
	const [posts, setPosts] = useState([]);

	const [filter, setFilter] = useState({ sort: "", query: "" });
	const [modal, setModal] = useState(false);
	const [totalPages, setTotalPages] = useState(0);
	const [limit, setLimit] = useState(10);
	const [page, setPage] = useState(1);
	const sortedAndSearchedPosts = usePosts(posts, filter.sort, filter.query);
	const [fetchPosts, isPostsLoading, postError] = useFetching(async () => {
		const response = await PostService.getAll(limit, page);
		setPosts([...posts, ...response.data]);
		const totalCount = response.headers["x-total-count"];
		setTotalPages(getPagesCount(totalCount, limit));
	});
	const lastElement = useRef();
	useObserver(lastElement, page < totalPages, isPostsLoading, () =>
		setPage(page + 1)
	);

	const createPost = (newPost) => {
		setPosts([...posts, newPost]);
		setModal(false);
	};
	const removePost = (post) => {
		setPosts(posts.filter((p) => p.id !== post.id));
	};

	const changePage = (page) => {
		setPage(page);
	};

	useEffect(() => {
		fetchPosts();
	}, [page, limit]);

	return (
		<div className="App">
			<MyButton style={{ marginTop: "30px" }} onClick={() => setModal(true)}>
				Создать пост
			</MyButton>
			<MyModal visible={modal} setVisible={setModal}>
				<PostForm create={createPost} />
			</MyModal>
			<hr style={{ margin: "15px 0" }} />
			<PostFilter filter={filter} setFilter={setFilter} />
			<MySelect
				value={limit}
				onChange={(value) => setLimit(value)}
				defaultValue="Количество элементов на странице"
				options={[
					{ value: 5, name: "5" },
					{ value: 10, name: "10" },
					{ value: 25, name: "25" },
					{ value: -1, name: "Показать всё" },
				]}
			/>
			{postError && <h1>Произошла ошибка: {postError}</h1>}
			<PostList
				remove={removePost}
				posts={sortedAndSearchedPosts}
				title={"Посты про языки"}
			/>
			<div
				ref={lastElement}
				style={{ height: "20px", background: "red" }}
			></div>
			{isPostsLoading && (
				<div
					style={{
						display: "flex",
						justifyContent: "center",
						marginTop: "50px",
					}}
				>
					<Loader />
				</div>
			)}
			<Pagination totalPages={totalPages} page={page} changePage={changePage} />
		</div>
	);
}

export default Posts;
