import {
  CompassOutlined,
  DotChartOutlined,
  EditOutlined,
  FileTextOutlined,
  GiftOutlined,
  HomeOutlined,
  LineChartOutlined,
  PlaySquareOutlined,
  RiseOutlined,
  SecurityScanOutlined,
  ShareAltOutlined,
  UserOutlined,
  DiscordOutlined,
  UsergroupAddOutlined,
  QuestionOutlined,
} from '@ant-design/icons';
import { Skeleton } from '@mantine/core';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useDispatch, useSelector } from 'react-redux';
import { useCookie } from 'react-use';

import { IRootState } from '../../store';
import { toggleSidebar } from '../../store/themeConfigSlice';

import { useGetAdminQuery } from '~/generated/graphql.types';
import { useWallet } from '~/hooks';
import { UserRole } from '~/utils/preferences';

const Sidebar = () => {
  const router = useRouter();
  const [currentMenu, setCurrentMenu] = useState<string>('');
  const [errorSubMenu, setErrorSubMenu] = useState(false);
  const themeConfig = useSelector((state: IRootState) => state.themeConfig);
  const semidark = useSelector((state: IRootState) => state.themeConfig.semidark);
  const domain = useSelector((state: IRootState) => state.themeConfig.domain);

  const toggleMenu = (value: string) => {
    setCurrentMenu((oldValue) => {
      return oldValue === value ? '' : value;
    });
  };
  const [cookieValue] = useCookie('userRoles');

  const [hasMultipleRoles, setHasMultipleRoles] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const [isAdvertiser, setIsAdvertiser] = useState(false);
  const [isPublisher, setIsPublisher] = useState(false);

  useEffect(() => {
    const userRoles = JSON.parse(cookieValue ?? '[]') as UserRole[];
    setHasMultipleRoles(userRoles.length > 1);
    setIsUser(userRoles.includes('user'));
    setIsAdvertiser(userRoles.includes('creator') || userRoles.includes('business'));
    setIsPublisher(userRoles.includes('publisher'));
  }, [cookieValue]);

  useEffect(() => {
    const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]');
    if (selector) {
      selector.classList.add('active');
      const ul: any = selector.closest('ul.sub-menu');
      if (ul) {
        let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link') || [];
        if (ele.length) {
          ele = ele[0];
          setTimeout(() => {
            ele.click();
          });
        }
      }
    }
  }, []);

  const dispatch = useDispatch();
  const { t } = useTranslation();

  const setActiveRoute = () => {
    const allLinks = document.querySelectorAll('.sidebar ul a.active');
    for (let i = 0; i < allLinks.length; i++) {
      const element = allLinks[i];
      element?.classList.remove('active');
    }
    const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]');
    selector?.classList.add('active');
  };

  useEffect(() => {
    setActiveRoute();
    if (window.innerWidth < 1024 && themeConfig.sidebar) {
      dispatch(toggleSidebar());
    }
  }, [router.pathname]);

  const [isAdmin, setIsAdmin] = useState(false);
  const { address } = useWallet();
  const { data: isAdminData } = useGetAdminQuery({ id: (address?.toLowerCase() as string) ?? '' });
  useEffect(() => {
    if (isAdminData?.admin) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [isAdminData]);

  return (
    <div
      className={` ${
        semidark ? 'dark' : ''
      } sidebar fixed bottom-0 top-0 z-50 h-full min-h-screen w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] transition-all duration-300 ${
        semidark ? 'text-white-dark' : ''
      }`}>
      <nav>
        <div className="h-full bg-white dark:bg-black">
          <div className="flex items-center justify-between px-4 py-3">
            {domain ? (
              <Link href="/" className="main-logo flex shrink-0 items-center">
                <img className="ml-[5px] w-8 h-8 object-contain  flex-none" src={`/images/logos/${domain}.png`} alt="logo" />
                <span className="h-full align-middle text-2xl font-semibold ltr:ml-1.5 rtl:mr-1.5 dark:text-white-light lg:inline">
                  {t(domain.toUpperCase())}
                </span>
              </Link>
            ) : (
              <Skeleton />
            )}

            <button
              type="button"
              className="collapse-icon flex h-8 w-8 items-center rounded-full transition duration-300 hover:bg-gray-500/10 rtl:rotate-180 dark:text-white-light dark:hover:bg-dark-light/10"
              onClick={() => dispatch(toggleSidebar())}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="m-auto h-5 w-5">
                <path
                  d="M13 19L7 12L13 5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  opacity="0.5"
                  d="M16.9998 19L10.9998 12L16.9998 5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          <PerfectScrollbar className="relative h-[calc(98vh-200px)]">
            <ul className="relative space-y-0.5 p-4 py-0 font-semibold">
              <li className="nav-item">
                <ul>
                  <br></br>
                  <label hidden={!hasMultipleRoles && !isAdmin}>Overall</label>
                  <li className="nav-item">
                    <Link href="/" className="group">
                      <div className="flex items-center">
                        <HomeOutlined rev={undefined} />
                        <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                          {t('Home')}
                        </span>
                      </div>
                    </Link>
                  </li>

                  <br hidden={!(isAdmin || (hasMultipleRoles && isUser))}></br>
                  <label hidden={!(isAdmin || (hasMultipleRoles && isUser))}>User</label>

                  <li className={`nav-item ${!isUser ? 'hidden' : ''}`}>
                    <Link href="/discover" className="group">
                      <div className="flex items-center">
                        <CompassOutlined rev={undefined} />
                        <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                          {t('Discover')}
                        </span>
                      </div>
                    </Link>
                  </li>
                  {/* <li hidden={!isUser} className="nav-item">
                    <Link href="/walletInsights" className="group">
                      <div className="flex items-center">
                        <SearchOutlined rev={undefined} />
                        <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                          {t('Wallet Insights')}
                        </span>
                      </div>
                    </Link>
                  </li> */}
                  <li hidden={!isUser && !isAdmin} className="nav-item">
                    <Link href="/credentials" className="group">
                      <div className="flex items-center">
                        <UserOutlined rev={undefined} />
                        <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                          {t('Profile')}
                        </span>
                      </div>
                    </Link>
                  </li>
                  <li hidden={!isUser && !isAdmin} className="nav-item opacity-50">
                    <Link href="#" className="group hover:bg-transparent">
                      <div className="flex items-center">
                        <RiseOutlined rev={undefined} />
                        <span className="text-gray ltr:pl-3 rtl:pr-3 dark:text-[#506690] ">
                          {t('Leaderboard (coming soon)')}
                        </span>
                      </div>
                    </Link>
                  </li>
                  <li hidden={!isUser && !isAdmin} className="nav-item opacity-50">
                    <Link href="#" className="group hover:bg-transparent">
                      <div className="flex items-center">
                        <GiftOutlined rev={undefined} />
                        <span className="text-gray ltr:pl-3 rtl:pr-3 dark:text-[#506690] ">
                          {t('Rewards (coming soon)')}
                        </span>
                      </div>
                    </Link>
                  </li>

                  <br hidden={!(isAdmin || (hasMultipleRoles && isAdvertiser))}></br>
                  <label hidden={!(isAdmin || (hasMultipleRoles && isAdvertiser))}>Advertiser</label>
                  <li hidden={!isAdvertiser && !isAdmin} className="nav-item">
                    <Link href="/ads" className="group">
                      <div className="flex items-center">
                        <EditOutlined rev={undefined} />
                        <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                          {t('Campaigns')}
                        </span>
                      </div>
                    </Link>
                  </li>
                  <li hidden={!isAdvertiser && !isAdmin} className="nav-item opacity-50">
                    <Link href="#" className="group hover:bg-transparent">
                      <div className="flex items-center">
                        <DotChartOutlined rev={undefined} />
                        <span className="text-gray ltr:pl-3 rtl:pr-3 dark:text-[#506690] ">
                          {t('Audiences (coming soon)')}
                        </span>
                      </div>
                    </Link>
                  </li>

                  <br hidden={!(isAdmin || (hasMultipleRoles && isPublisher))}></br>
                  <label hidden={!(isAdmin || (hasMultipleRoles && isPublisher))}>Publisher</label>
                  <li hidden={!isPublisher && !isAdmin} className="nav-item">
                    <Link href="/wizard" className="group">
                      <div className="flex items-center">
                        <PlaySquareOutlined rev={undefined} />
                        <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                          {t('Wizard')}
                        </span>
                      </div>
                    </Link>
                  </li>
                  <li hidden={!isPublisher && !isAdmin} className="nav-item opacity-50">
                    <Link href="#" className="group hover:bg-transparent">
                      <div className="flex items-center">
                        <LineChartOutlined rev={undefined} />
                        <span className="text-gray ltr:pl-3 rtl:pr-3 dark:text-[#506690] ">
                          {t('Performace (coming soon)')}
                        </span>
                      </div>
                    </Link>
                  </li>

                  <div hidden={!isAdmin}>
                    <br hidden={!hasMultipleRoles || !isAdmin}></br>

                    <label>Admin</label>
                    <li className="nav-item">
                      <Link href="/audiences" className="group">
                        <div className="flex items-center">
                          <UsergroupAddOutlined rev={undefined} />
                          <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                            {t('Audiences')}
                          </span>
                        </div>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link href="/segments" className="group">
                        <div className="flex items-center">
                          <SecurityScanOutlined rev={undefined} />
                          <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                            {t('Segments')}
                          </span>
                        </div>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link href="/publishers" className="group">
                        <div className="flex items-center">
                          <ShareAltOutlined rev={undefined} />
                          <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                            {t('Publishers')}
                          </span>
                        </div>
                      </Link>
                    </li>
                  </div>
                </ul>
              </li>
            </ul>
          </PerfectScrollbar>

          <ul className="relative p-4 py-0 font-semibold">
            <li className="nav-item hover:cursor-pointer">
              <Link href="https://docs.targecy.xyz/" target="_blank" className="group hover:bg-transparent ">
                <div className="flex items-center">
                  <FileTextOutlined rev={undefined} />
                  <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                    {t('Docs')}
                  </span>
                </div>
              </Link>
            </li>
            <li className="nav-item hover:cursor-pointer">
              <Link href="https://discord.gg/smyzhu7Gyt" target="_blank" className="group hover:bg-transparent ">
                <div className="flex items-center">
                  <DiscordOutlined rev={undefined} />
                  <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                    {t('Discord')}
                  </span>
                </div>
              </Link>
            </li>
            <li className="nav-item hover:cursor-pointer">
              <Link href="mailto:help@targecy.xyz" target="_blank" className="group hover:bg-transparent ">
                <div className="flex items-center">
                  <QuestionOutlined rev={undefined} />
                  <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                    {t('Help')}
                  </span>
                </div>
              </Link>
            </li>
          </ul>

          {/* <div className="flex justify-center p-3">
            <span className="hover:color-primary flex align-middle">
              Find help
              <Link href="mailto:help@targecy.xyz" target="_blank" className="group flex pl-1 hover:text-primary">
                <div className="flex items-center">here</div>
              </Link>
              {'. '}
            </span>
            <span className="hover:color-primary flex pl-1 align-middle">
              Follow us on
              <Link
                href="https://twitter.com/targecy_ads"
                target="_blank"
                className="group flex pl-2 hover:text-primary">
                <div className="flex items-center">
                  <TwitterOutlined rev={undefined} />
                </div>
              </Link>
            </span>
          </div> */}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
