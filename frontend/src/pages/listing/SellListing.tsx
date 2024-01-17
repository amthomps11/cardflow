import { useEffect, useState } from 'react';
import { Link, useLoaderData, useParams, useNavigate } from 'react-router-dom';
import {
  CardDetailsLoaderData,
  YugiohCardListing,
  YugiohCardSellListing,
} from '../../services/yugioh/types';
import { yugiohService } from '../../services/yugioh/yugiohService';
import { useEffectAfterInitialLoad } from '../../util/useEffectAfterInitialLoad';
import YugiohCardMarket from '../../components/yugioh/table/market/YugiohCardMarket';
import { Pagination } from '@mui/material';
import ListingTopBar from '../../components/sellListing/ListingTopBar';
import NewListingTopBar from '../../components/sellListing/NewListingTopBar';
import PaymentsIcon from '@mui/icons-material/Payments';
import DeleteIcon from '@mui/icons-material/Delete';
import DiamondIcon from '@mui/icons-material/Diamond';
import TagIcon from '@mui/icons-material/Tag';
import VisibilityIcon from '@mui/icons-material/Visibility';

function SellListing(): JSX.Element {
  const [page, setPage] = useState(1);
  const data = useLoaderData() as CardDetailsLoaderData;
  const params = useParams();
  const id = Number(params.id);
  const cardId = Number(params.cardid);
  const { cardInSet, cardListings: cardListingsData } = data;
  const [cardListings, setCardListings] = useState(cardListingsData);
  const navigate = useNavigate();

  const [formData, setFormData] = useState<YugiohCardListing>({
    id: 0,
    quantity: 0,
    condition: 'poor',
    price: 0,
    is_sold: true,
    is_listed: true,
    card: 0,
    user_name: '',
    user: 0,
    card_name: '',
    card_set_id: 0,
  });

  useEffect(() => {
    async function loadCardListing() {
      const currentCard: YugiohCardListing = await yugiohService.getListingById(Number(params.id));
      if (currentCard && currentCard !== null) {
        setFormData(() => ({
          card: currentCard.card,
          quantity: currentCard.quantity,
          condition: currentCard.condition,
          price: currentCard.price,
          is_sold: currentCard.is_sold,
          is_listed: currentCard.is_listed,
          id: currentCard.id,
          user_name: currentCard.user_name,
          user: currentCard.user,
          card_name: currentCard.card_name,
          card_set_id: currentCard.card_set_id,
        }));
      }
    }
    loadCardListing();
  }, []);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    let newValue: string | boolean = value;

    if (type === 'checkbox') {
      // 'checked' is only a property on input elements, specifically checkboxes
      newValue = (e.target as HTMLInputElement).checked;
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: newValue,
    }));
  };

  async function deleteListing() {
    try {
      await yugiohService.deleteListingById(Number(params.id));
      navigate('/sell/manage');
    } catch (error) {}
  }
  function delistItem() {
    try {
      if (formData.is_listed === true) {
        yugiohService.editListing({ ...formData, is_listed: false });
      } else {
        yugiohService.editListing({ ...formData, is_listed: true });
      }
    } catch (error) {}
  }

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    try {
      const newData: YugiohCardSellListing = {
        quantity: Number(formData.quantity),
        condition: formData.condition,
        price: Number(formData.price),
        is_sold: false,
        is_listed: formData.is_listed,
        card: Number(params.id),
      };
      await yugiohService.sellCardListing(newData);
    } catch (error) {}
  }

  async function updateListing(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    try {
      const newData: YugiohCardSellListing = {
        quantity: Number(formData.quantity),
        condition: formData.condition,
        price: Number(formData.price),
        is_sold: false,
        is_listed: formData.is_listed,
        card: Number(params.id),
      };
      await yugiohService.updateCardListing(newData, id);
    } catch (error) {}
  }

  const pages = Math.ceil(cardListings.count / 10);
  function changePage(_event: React.ChangeEvent<unknown>, page: number) {
    yugiohService
      .getCardListingsByCardSetId(cardId ? cardId : id, page)
      .then((data) => {
        setCardListings(data);
        setPage(page);
      })
      .catch(() => {}); // TO-DO: implement feedback for failed requests.
  }

  useEffectAfterInitialLoad(() => {
    yugiohService
      .getCardListingsByCardSetId(cardId ? cardId : id)
      .then(setCardListings)
      .catch();
    setPage(1);
  }, [params.cardid]);
  return (
    <section className="bg-[#F5F5F5]">
      <ListingTopBar />
      <NewListingTopBar
        handleSubmit={id && cardId ? updateListing : handleSubmit}
        quantity={formData.quantity}
        price={formData.price}
        condition={formData.condition}
        card={Number(params.cardid)}
      />
      <div className="block mt-20 ml-40 mr-40 bg-white rounded-lg">
        <div className="flex flex-col border border-stone-300">
          <div className="bg-white ml-4 p-8 w-[314px] h-[422px] flex">
            <img src={cardInSet.yugioh_card.image} />
            <div>
              <div>
                <h3
                  className="ml-8 text-black text-nowrap text-4xl font-medium"
                  style={{ whiteSpace: 'nowrap' }}
                >
                  {cardInSet.yugioh_card.card_name}
                </h3>
                <div className="absolute right-48 top-80">
                  {id && cardId ? (
                    <button
                      onClick={deleteListing}
                      className=" flex justify-center items-center w-20 h-8  mt-4 text-sm text-gray-700 border border-stone-300 pl-3 pr-4 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                      Delete
                    </button>
                  ) : null}

                  <Link
                    to="/listing/newlisting"
                    className=" flex justify-center items-center w-20 h-8  mt-4 text-sm text-gray-700 border border-stone-300 pl-3 pr-4 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    <DeleteIcon className="p-1" />
                    Clear
                  </Link>
                  {id && cardId ? (
                    <button
                      onClick={delistItem}
                      className=" flex justify-center items-center w-20 h-8  mt-4 text-sm text-gray-700 border border-stone-300 pl-3 pr-4 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                      <VisibilityIcon className="p-1" />
                      Delist
                    </button>
                  ) : null}
                </div>
              </div>
              <div className="flex">
                <div className="w-[61px] h-[23px] rounded-[10px] text-neutral-500 text-sm font-normal text-center ml-8 mt-4 border border-neutral-300">
                  {cardInSet.set.set_code}
                </div>
                <div className="w-[61px] h-[23px] rounded-[10px] text-neutral-500 text-sm font-normal text-center ml-4 mt-4 border border-neutral-300">
                  {cardInSet.rarity.rarity_code}
                </div>
              </div>
              <div className="flex mt-20">
                <div className="inline-flex items-center p-1 ml-8 border rounded-md border-gray-300">
                  <span className="pl-1 pr-1 text-gray-700 text-sm flex items-center">
                    <TagIcon />
                  </span>
                  <input
                    type="number"
                    name="quantity"
                    min="0"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="w-24 px-2 py-0.5 text-sm text-gray-700 border-none focus:ring-0 focus:outline-none"
                    placeholder="Quantity"
                  />
                </div>
                <div className="inline-flex items-center p-1 ml-8 border rounded-md border-gray-300">
                  <span className="pl-1 pr-1 text-gray-700 text-sm flex items-center">
                    <DiamondIcon />
                  </span>
                  <select
                    id="condition"
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    className="w-28 px-2 py-0.5 text-sm text-left text-gray-700 border-none focus:ring-0 focus:outline-none"
                  >
                    <option value="poor">Poor</option>
                    <option value="good">Good</option>
                    <option value="played">Played</option>
                    <option value="excellent">Excellent</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="inline-flex items-center p-1 mt-16 ml-8 border rounded-md border-gray-300">
                  <span className="pl-1 pr-1 text-gray-700 text-sm flex items-center">
                    <PaymentsIcon />
                  </span>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    className="w-24 px-2 py-0.5 text-sm text-gray-700 border-none focus:ring-0 focus:outline-none"
                    placeholder="Price"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full border-b border-l border-r border-stone-300">
          <h3 className="ml-12 text-lg font-semibold mb-4 pt-4">Market information</h3>
          <YugiohCardMarket listings={cardListings.results} />
          <Pagination
            page={page}
            className="flex justify-center pb-8"
            count={pages}
            onChange={changePage}
          />
        </div>
      </div>
    </section>
  );
}

export default SellListing;
