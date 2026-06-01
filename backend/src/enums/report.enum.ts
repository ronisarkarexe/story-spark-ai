export enum ReportReason {
  SPAM = "SPAM",
  HATE_SPEECH = "HATE_SPEECH",
  INAPPROPRIATE = "INAPPROPRIATE",
  MISINFORMATION = "MISINFORMATION",
  OTHER = "OTHER",
}

export enum ReportStatus {
  PENDING = "PENDING",
  REVIEWED = "REVIEWED",
  DISMISSED = "DISMISSED",
}

export enum ReportTargetType {
  POST = "POST",
  COMMENT = "COMMENT",
}