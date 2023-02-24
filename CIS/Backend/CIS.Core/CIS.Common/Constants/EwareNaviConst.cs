using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CIS.Common.Constants
{
    public static class EwareNaviConst
    {
        public const string WAREHOUSE_CODE_COMMON = "COMMON";
        public const string WAREHOUSE_CODE_TRANSIT = "TRANSIT";
        public const string AreaNo_STAG = "STAG";

        public const string WARNING_MSG_STOCKDUPLICATE = "Duplicate pallet no found in inventory. At warehouse: {0}, area: {1}, location: {2}";
        public const string WARNING_MSG_SO_NO_RESERVERD = "Can’t find any SO item reserved in records";
        public const string WARNING_MSG_PALLET_NO_RESERVERD = "SO.: {0} exceeded reserved storage plan. Please add pallet on your reservation plan/modify";
        public const string WARNING_MSG_WRONG_DESTINATION = "Wrong destination. This production output pallet should be sent to {0}";
        public const string WARNING_MSG_NOT_CHECKOUT = "This pallet has not performed Production Checkout yet";

        public const string WARNING_MSG_WRONG_WAREHOUSE = "ERROR: This Pallet is not assigned for this warehouse";

        public const string WARNING_MSG_FAILED_CHECKIN = "ERROR: Failed to check in pallet : {0}. Please contact Administrator!";

        public const string WARNING_MSG_FAILED_POST_WEBADMIN = "ERROR: Failed to post Web Admin. Please contact Administrator!";

        public const string WARNING_MSG_PALLET_IOSSCANNED = "This pallet has perfomed IOT scanned.";
    }
}
