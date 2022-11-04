import { ScriptType } from "./script-type";

const scriptTypeFileExtension: Map<ScriptType, string> = new Map();
scriptTypeFileExtension.set(ScriptType.Bash, "sh");

export default scriptTypeFileExtension;