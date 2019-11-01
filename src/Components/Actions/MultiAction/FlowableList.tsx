import * as React from "react";
import useDimensions from "react-use-dimensions";

const ListItem = (props: React.Props<null>) => {
  const [ref, { width, height }] = useDimensions();

  console.log(width, height);

  return (
    <>
      <div style={{ width: 0, height: 0 }}>{props.children}</div>
      <div
        style={{
          visibility: "hidden",
          position: "absolute",
          width: "100%",
          height: "100%"
        }}
      >
        <div ref={ref}>{props.children}</div>
      </div>
    </>
  );
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
