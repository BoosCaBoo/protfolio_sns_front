import { Button } from "@chakra-ui/button";
import { VFC, ReactNode, memo } from "react";

type Props = {
    children: ReactNode;
    loading?: boolean;
    disabled?: boolean;
    onClick: () => void;
}

export const PrimaryButton: VFC<Props> = memo((props) => {
    const { children, loading = false, disabled= false, onClick } = props;
    return (
        <Button
            bg="teal.400"
            color="white"
            _hover={{ opacity: 0.9 }}
            disabled={ disabled || loading }
            loading={loading}
            onClick={onClick}
        >
            { children }
        </Button>
    )

})