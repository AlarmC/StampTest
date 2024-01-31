import { forwardRef, useRef } from "react";

import styled from "styled-components";

function SignUpInp() {
  const inpUsingRef = useRef([]);

  function inpEvent(event) {
    const email_test =
      /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
    const password_test = /^.{8,32}$/;
    const e_target = event.target;

    switch (e_target) {
      case inpUsingRef.current[0]: //case 이름
        if (e_target.value !== "") {
          //   pUsingRef.current[0].style.display = 'none';
          //   inpValueArry[0] = true;
        } else {
          // pUsingRef.current[0].style.display = 'block';
          inpUsingRef.current[0].style.border = "1px solid #blue";
        }
        break;
    }
  }

  const Inputfor = forwardRef((props, ref) => {
    return <input type="text" ref={ref} />;
  });

  const Input = styled(Inputfor)``;

  return (
    <Input onKeyUp={inpEvent} ref={(elem) => (inpUsingRef.current[0] = elem)} />
  );
}

export default SignUpInp;
