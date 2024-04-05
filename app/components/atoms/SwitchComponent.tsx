import { UserInfo } from "../../hooks/useCheckAuth";
import { UserMenu } from "../templates/UserMenu/UserMenu";

interface ISwitchComponentProps {
  user: UserInfo | null | undefined;
}

export function SwitchComponent(props: Readonly<ISwitchComponentProps>) {
  console.log("render switch", props)

  if (props.user) return <UserMenu />;

  return <></>;
}
