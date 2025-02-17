"use client";
import { useSession, signIn, signOut, getCsrfToken } from "next-auth/react";
import { useState } from "react";
import { LoginButton, LogoutButton } from "@/components/buttons.component";
import { ToastContainer, toast } from "react-toastify";
import useSWR from "swr";
import { BsFillPlusSquareFill } from "react-icons/bs";
import { createComment, createPost, handleDelete } from "./fetchRequests";
import { NextRequest } from "next/server";

export const fetcher = (url: string, config?: RequestInit | undefined) =>
  fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error(res.statusText);
    }

    return res.json();
  });
// interface PostsHookParams {
//   currentPage: number;
//   pageSize: number;
// }
export let PostsHook = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const urlParams = new URLSearchParams();

  urlParams.append("page", currentPage.toString());
  urlParams.append("pageSize", pageSize.toString());

  let { data, error, mutate } = useSWR(
    `/api/forum?${urlParams.toString()}`,
    fetcher,
  );

  let loading = !data && !error;

  const nextPage = () => {
    if (data?.postsLength / pageSize <= currentPage) {
      toast.error("Already on last page!");
      return console.log("Already on last page!");
    }
    setCurrentPage(currentPage + 1);
  };
  const prevPage = () => {
    if (currentPage === 1) {
      toast.error("Already on page 1!");
      return console.log("cant go to page 0");
    }
    setCurrentPage(currentPage - 1);
  };

  const maxPage = data?.postsLength / pageSize;

  return {
    allPosts: data?.posts,
    error,
    loading,
    mutate,
    nextPage,
    prevPage,
    maxPage,
    currentPage,
  };
};

export default function Forum() {
  const { data: session } = useSession();
  const [showCreatePostModal, setShowCreatePostModal] =
    useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editText, setEditText] = useState<string>("");
  const [editTitle, setEditTitle] = useState<string>("");
  const {
    allPosts,
    error,
    loading,
    mutate,
    nextPage,
    prevPage,
    maxPage,
    currentPage,
  } = PostsHook();

  function clickModal() {
    setShowCreatePostModal(!showCreatePostModal);
  }
  function clickEditModal(title: string, content: string) {
    setEditTitle(title);
    setEditText(content);
    setShowEditModal(!showEditModal);
    console.log(editTitle);
    console.log(editText);
  }

  if (!session?.user) {
    return (
      <>
        <div className={`text-center`}>
          <h1>Du er ikke logget inn! Logg inn her:</h1>
          <LoginButton />
        </div>
      </>
    );
  }

  function handleEdit() {
    // console.log(title);
    // console.log(content);
  }

  return (
    <>
      <div className={`text-center content-center m-5 `}>
        <button onClick={clickModal}>
          <BsFillPlusSquareFill
            className={`w-7 h-7  hover:text-slate-500 transition-colors duration-150`}
            title="Create new post!"
          />
        </button>
        {loading && (
          <>
            <div role="status" className={`text-center block m-auto`}>
              <svg
                aria-hidden="true"
                className="w-8 h-8 text-gray-200 animate-spin text-center block m-auto  dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          </>
        )}
        {allPosts && (
          <>
            <div id="postsContainer">
              {allPosts.map((o: any) => {
                var mySqlDate = o.createdAt.slice(0, 19).replace("T", " ");
                let createdPost = false;
                //@ts-ignore
                if (o.user.id === session.user?.id) createdPost = true;

                return (
                  <div
                    className=" w-3/4 mx-auto bg-slate-800 rounded shadow-md p-4 m-10"
                    key={o.id}
                    id={o.id}
                  >
                    <h2 className="text-xl font-bold mb-2 whitespace-normal">
                      {o.title}
                    </h2>
                    <p className="text-gray-300 mb-4 whitespace-normal ">
                      {o.content}
                    </p>
                    <div className="flex justify-between items-center text-white mt-10">
                      <p className="text-sm">Created at: {mySqlDate}</p>
                      <p className="text-sm">{o.user.name}</p>
                    </div>
                    {createdPost && (
                      <div className="mt-4 flex justify-end" id={o.user.id}>
                        <button
                          className="px-2 py-1 bg-blue-500 text-white rounded-md mr-2"
                          onClick={() => {
                            clickEditModal(o.title, o.content);
                          }}
                          id={o.id}
                        >
                          Edit
                        </button>
                        <button
                          className="px-2 py-1 bg-red-500 text-white rounded-md"
                          onClick={async () => {
                            await handleDelete(o.id);
                            mutate();
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                    <div className="mt-4">
                      <input
                        type="text"
                        className="w-4/5 border border-gray-300 rounded-full m-2 p-2"
                        placeholder="Add a comment"
                      />
                      <button
                        className="rounded-full bg-gray-700 p-2 inline-flex items-center justify-center"
                        onClick={createComment}
                      >
                        add comment
                      </button>
                    </div>
                    <div className="mt-5">
                      <h3 className="text-lg font-bold mb-2">Comments</h3>
                      <div className="bg-slate-900 p-4 rounded">
                        <p>Comment 1</p>
                        <p>Comment 2</p>
                      </div>
                    </div>
                  </div>
                );
              })}
              {currentPage > 1 && (
                <button
                  onClick={prevPage}
                  className=" rounded-md bg-gray-800 p-2 inline-flex items-center justify-center m-5"
                >
                  {`<-`}
                </button>
              )}
              {currentPage < maxPage && (
                <button
                  onClick={nextPage}
                  className=" rounded-md bg-gray-800 p-2 inline-flex items-center justify-center m-5"
                >
                  {`->`}
                </button>
              )}
            </div>
          </>
        )}
        {showCreatePostModal && (
          <div className="fixed w-full p-4 md:inset-0 h-[calc(100%-1rem)] max-h-full text-center m-auto">
            <div className="relative w-full max-w-md max-h-full m-auto">
              <div className="bg-slate-500 rounded-lg shadow dark:bg-gray-700  border border-black ">
                <button
                  type="button"
                  className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                  data-modal-hide="authentication-modal"
                  onClick={clickModal}
                >
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
                <div className="px-6 py-6 lg:px-8">
                  <form
                    className="space-y-6"
                    onSubmit={async (e) => {
                      await createPost(editTitle, editText);
                      clickModal();
                      mutate();
                    }}
                  >
                    <div>
                      <label className="block mb-2 text-sm font-medium text-white">
                        Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        id="title"
                        className="bg-slate-600 border border-gray-700 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        placeholder="Title"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-white">
                        Content
                      </label>
                      <textarea
                        name="content"
                        id="content"
                        placeholder="text"
                        className="bg-slate-600 border border-gray-700 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full text-white bg-slate-700 hover:bg-slate-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      Create post
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
        {showEditModal && (
          <div className="fixed w-full p-4 md:inset-0 h-[calc(100%-1rem)] max-h-full text-center m-auto">
            <div className="relative w-full max-w-md max-h-full m-auto">
              <div className="bg-slate-500 rounded-lg shadow dark:bg-gray-700  border border-black ">
                <button
                  type="button"
                  className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                  data-modal-hide="authentication-modal"
                  onClick={() => {
                    clickEditModal("", "");
                  }}
                >
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
                <div className="px-6 py-6 lg:px-8">
                  <form className="space-y-6" onSubmit={handleEdit}>
                    <div>
                      <h1>Edit post</h1>
                      <label className="block mb-2 text-sm font-medium text-white">
                        Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        id="title"
                        className="bg-slate-600 border border-gray-700 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        placeholder="Title"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-white">
                        Content
                      </label>
                      <textarea
                        name="content"
                        id="content"
                        placeholder="text"
                        className="bg-slate-600 border border-gray-700 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full text-white bg-slate-700 hover:bg-slate-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      Create post
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
        <ToastContainer
          position={"top-right"}
          autoClose={5000}
          hideProgressBar={false}
          closeOnClick={true}
          pauseOnHover={true}
          draggable={true}
          theme={"dark"}
        />
      </div>
    </>
  );
}
