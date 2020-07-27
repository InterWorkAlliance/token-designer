type ArtifactUpdate = {
    action: "edit" | "add" | "delete",
    type: "alias",
    existing?: string,
};

export default ArtifactUpdate;