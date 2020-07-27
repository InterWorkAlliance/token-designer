type ArtifactUpdate = {
    action: "editListItem" | "editString" | "add" | "delete",
    type: "alias" | "symbol",
    existing?: string,
};

export default ArtifactUpdate;