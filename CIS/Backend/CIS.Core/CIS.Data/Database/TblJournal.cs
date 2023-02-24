using System;
using System.Collections.Generic;

#nullable disable

namespace CIS.Data.Database
{
    public partial class TblJournal
    {
        public long JournalId { get; set; }
        public string JournalNo { get; set; }
        public string LocationId { get; set; }
        public string Description { get; set; }
        public DateTime? CutOffDate { get; set; }
        public DateTime? CreatedOn { get; set; }
        public string CreatedBy { get; set; }
        public byte? Verified { get; set; }
        public byte? SupervisorApproved { get; set; }
        public byte? FinanceApproved { get; set; }
        public string Status { get; set; }
        public DateTime? UpdatedOn { get; set; }
        public string UpdatedBy { get; set; }
        public bool? Del { get; set; }
        public int? FileCount { get; set; }
        public string AttachmentName { get; set; }
    }
}
