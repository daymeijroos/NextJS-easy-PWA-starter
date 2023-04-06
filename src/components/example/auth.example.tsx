import { useSession } from "next-auth/react";
import React from "react";
import { api } from "../../utils/api";
import { Button } from "../aria/button";
import { TextField } from "../aria/text-field";

let title = "";
let content = "";

const AuthExample: React.FC = () => {
  const { data: sessionData } = useSession();
  const context = api.useContext()

  const { mutate } = api.example.createPost.useMutation({
    onSuccess: () => {
      // invalidate the query to update the UI
      context.example.posts.invalidate();
    },
  });

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {sessionData?.user && (
        <>
          <form className="flex flex-col items-end">
            <TextField label="title" onChange={(change) => {title = change}}></TextField>
            <TextField label="content" onChange={(change) => {content = change}}></TextField>
            <Button onPress={() => mutate({title: title, content: content})}>Post</Button>
          </form>
        </>
      )}
    </div>
  );
};

export default AuthExample;