import { toast } from "react-toastify";

export async function createComment(req: any) {
  event?.preventDefault();
  const body = {
    commentBody: req.target.parentElement.firstChild.value,
    postId: req.target.parentElement.parentElement.id,
  };

  const options = {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  };
  //@ts-ignore
  let test = await fetch("./api/forum/comments", options)
    .then(function (response) {
      // The response is a Response instance.
      // You parse the data into a useable format using `.json()`
      return response.json();
    })
    .then(function (data) {
      toast.success("🦄 Comment created!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });

      // `data` is the parsed version of the JSON returned from the above endpoint.
      console.log(data);
    });
  console.log(test);
}

export async function handleDelete(postId: string) {
  const urlParams = new URLSearchParams();
  console.log();

  urlParams.append("postId", postId);

  const options = {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  };
  //@ts-ignore
  let test = await fetch(`./api/forum?${urlParams}`, options)
    .then(function (response) {
      // The response is a Response instance.
      // You parse the data into a useable format using `.json()`
      return response.json();
    })
    .then(function (data) {
      toast.success("Post Deleted!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });

      // `data` is the parsed version of the JSON returned from the above endpoint.
      console.log(data);
    });
  console.log(test);
  console.log("deleted");
}

export async function createPost(postTitle: string, postText: string) {
  event?.preventDefault();
  const body = {
    postTitle: postTitle,
    postBody: postText,
    // posterId: JSON.stringify(session?.token?.id),
  };

  const options = {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  };
  //@ts-ignore
  let test = await fetch("./api/forum", options)
    .then(function (response) {
      // The response is a Response instance.
      // You parse the data into a useable format using `.json()`
      return response.json();
    })
    .then(function (data) {
      toast.success("🦄 Post created!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });

      // `data` is the parsed version of the JSON returned from the above endpoint.
      console.log(data);
    });
  console.log(test);
}
