type ArtifactUpdate = {
    action: "editListItem" | "editString" | "add" | "delete",
    type: "alias" | "symbol" | "businessDescription",
    existing?: string,
};

export default ArtifactUpdate;