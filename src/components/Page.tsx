import { ReactNode } from "react";

const Page = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex justify-center py-8 min-h-screen w-screen">
      <div className="w-4/5 space-y-6">{children}</div>
    </div>
  );
};

export default Page;
