import Permissions from "components/models/Permissions";
const canShare = (selectedTools) => {
    return (
        selectedTools &&
        selectedTools.length > 0 &&
        !selectedTools.find((tool) => tool.permission !== Permissions.OWN)
    );
};

export { canShare };
