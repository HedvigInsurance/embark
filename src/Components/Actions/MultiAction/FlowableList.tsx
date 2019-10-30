import * as React from "react";
import useDimensions from "react-use-dimensions";

const ListItem = (props: React.Props<null>) => {
  const [ref, { width, height }] = useDimensions();

  console.log(width, height);

  return <div ref={ref}>{props.children}</div>;
};

export const FlowableList = (props: React.Props<null>) => {
  return (
    <div>
      {React.Children.map(props.children, item => {
        return <ListItem>{item}</ListItem>;
      })}
    </div>
  );
};
