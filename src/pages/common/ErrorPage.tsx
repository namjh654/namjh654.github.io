import { useState, useEffect } from "react";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import "./ErrorPage.css";
interface ErrorResponse {
  message: string;
  data?: any;
}

export default function ErrorPage() {
  const error = useRouteError();
  const [errorResponse, setErrorResponse] = useState<ErrorResponse>({
    message: "알 수 없는 오류가 발생했습니다.",
  });

  useEffect(() => {
    function errorMessage(error: unknown): ErrorResponse {
      if (isRouteErrorResponse(error)) {
        return {
          message: `${error.status} ${error.statusText}`,
          data: error.data,
        };
      }
      if (error instanceof Error) {
        return { message: error.message };
      }
      if (typeof error === "string") {
        return { message: error };
      }

      console.error("Unknown error:", error);
      return { message: "Unknown error" };
    }

    setErrorResponse(errorMessage(error));
  }, [error]);

  return (
    <div id="error-page">
      <div className="error-container">
        <div className="error-code">404</div>
        <div className="divider"></div>
        <div className="error-details">
          <p>죄송합니다, 예상치 못한 오류가 발생했습니다.</p>
          <p>
            <i>{errorResponse.message}</i>
          </p>
        </div>
      </div>
    </div>
  );
}
