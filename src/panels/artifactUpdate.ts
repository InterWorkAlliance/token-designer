type ArtifactUpdate = {
  action: "editListItem" | "editString" | "add" | "delete";
  type:
    | "alias"
    | "symbol"
    | "businessDescription"
    | "businessExample"
    | "comments";
  existing?: string;
};

export default ArtifactUpdate;
