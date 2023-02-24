using CIS.Common.Constants;
using CIS.Data.Model;
using CIS.Services.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CIS.BusinessLogic.Pallet
{
    public class StockBLL
    {
        public static int GetPalletType(List<EWN_CompletedPalletDTO> stockMTO, List<PalletDetailDTO> stockMTS)
        { 
            if (stockMTO.Count() > 0)
                return (int)GlobalConst.StockMTO_MTS.MTO;

            if (stockMTS.Count() > 0)
                return (int)GlobalConst.StockMTO_MTS.MTS;

            return (int)GlobalConst.StockMTO_MTS.None;
        }


        public static void GenerateCustPOPLanDay(IEwareNaviService _EwareNaviService, List<EWN_CompletedPalletDTO> stockMTS)
        {
            foreach(var palletDto in stockMTS)
            {
                palletDto.PlanDay = _EwareNaviService.GetPlanDay(palletDto.PONumber);
                palletDto.CustomerPONumber = _EwareNaviService.GetCustPONumber(palletDto.PONumber);
            }
        }
    }
}
