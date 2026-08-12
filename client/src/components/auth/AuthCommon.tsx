import { FetchError } from "../../api/base";
import ErrorBox from "../ErrorBox";

export function getAuthErrorBox(error: Error | null) {
  if (!error) return error;

  return error instanceof FetchError ? <ErrorBox message={error.toMessage()} details={error.details} /> : <ErrorBox message={error.message} details={null} />
}
