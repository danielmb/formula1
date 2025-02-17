"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import useSWR from "swr";
import axios, { AxiosRequestConfig } from "axios";
import { Teams } from "@/types/teams.types";
import Link from "next/link";
export const fetcher = (url: string, config?: RequestInit | undefined) =>
  fetch(url, config).then((res) => {
    if (!res.ok) {
      throw new Error(res.statusText);
    }

    return res.json();
  });

// const CalenderHook = () => {
//   const { data: calender, error, isLoading } = useSWR("/api/calender", fetcher);
//   return { calender, error, isLoading };
// };

export let CalenderHook = () => {
  let { data, error, mutate } = useSWR(`/api/teams`, fetcher);

  let loading = !data && !error;
  if (data) {
    data = JSON.parse(data);
    data = data.elements[1].elements[0].elements;
    console.log(data);
  }
  return { teams: data, error, loading };
};

export default function Calender() {
  const { data: session } = useSession();
  const { teams, error, loading } = CalenderHook();
  console.log(teams);
  if (loading) {
    return (
      <>
        <h1 className={`text-center`}>LOADING TEAMS</h1>
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
    );
  } else {
    return (
      <>
        <div className={`text-center content-center m-5 `}>
          {teams &&
            teams.map((o: Teams) => {
              console.log(o);
              return (
                <div
                  key={o.attributes.constructorId}
                  id={o.attributes.constructorId}
                  className={`bg-slate-800 m-10 rounded-md`}
                >
                  <Link href={o.attributes.url}>
                    <h1>{o.elements[0].elements[0].text}</h1>
                    <p>Team Id: {o.attributes.constructorId}</p>
                    <p>Nationality of Team: {o.elements[1].elements[0].text}</p>
                  </Link>
                </div>
              );
            })}
        </div>
      </>
    );
  }
}
