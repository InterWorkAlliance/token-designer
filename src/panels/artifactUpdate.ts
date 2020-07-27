type ArtifactUpdate = {
    action: "edit" | "add" | "delete",
    type: "alias",
    existing?: string,
    updated?: string,
};

export default ArtifactUpdate;