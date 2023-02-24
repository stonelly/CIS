using CIS.Data.Database;
using CIS.Data.Model;
using CIS.Data.Model.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CIS.Services.Interface
{
    public interface IFloorSystemrService
    {
        Task<List<EWN_CompletedPalletDTO>> USP_EWN_GetPalletData(string palletID);

        Task<int> FSPostD365FromFGReceivedPallet(string palletID, string plantNo, DateTime dateScanned);

        Task<Boolean> USP_EWN_ValidateIOTPallet(string palletID);
        Task<Boolean> USP_EWN_UpdPalletCompltScannedTimeByCIS(string palletID);

    }
}
