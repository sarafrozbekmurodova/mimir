import React, { FC, useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../hooks/useTypedSelector';
import { useGetMaterialByIdentifierQuery } from '@mimir/apollo-client';
import { removeIdentifier } from '../../store/slices/identifierSlice';
import { ReactComponent as ArrowIcon } from '../../../assets/ArrowUp2.svg';
import { Oval } from 'react-loader-spinner';
import DonateViaISBN from '../DonateViaISBN';
import DonateBook from '../DonateBook';
import Modal from '../Modal';
import ErrorMessage from '../ErrorMessge';
import styled from '@emotion/styled';
import { colors, dimensions } from '@mimir/ui-kit';

const WrapperInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin-top: 3.5rem;
`;

const TitleInfo = styled.h1`
  font-weight: 700;
  font-size: ${dimensions.xl};
  line-height: ${dimensions.xl_2};
  color: ${colors.main_black};
  margin-bottom: ${dimensions.base};
`;

const SubTitle = styled.h3`
  font-weight: 300;
  font-size: ${dimensions.base};
  color: ${colors.main_black};
  line-height: ${dimensions.xl};
`;

const BackSpan = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin-top: ${dimensions.xl_3};
  font-weight: 600;
  font-size: ${dimensions.base};
  color: #000000;
  cursor: pointer;
`;

const WrapperLoader = styled.div`
  display: flex;
  justify-content: center;
`;

const DonateBookFlow = () => {
  const dispatch = useDispatch();
  const { identifier } = useAppSelector((state) => state.identifier);
  const { location } = useAppSelector((state) => state.user);
  const [isShowError, setIsShowError] = useState<boolean>(false);
  const [showEmptyContentDonate, setShowEmptyContentDonate] =
    useState<boolean>(false);

  const { data, loading, error } = useGetMaterialByIdentifierQuery({
    skip: !identifier,
    variables: {
      identifier: String(identifier.split('-').join('')),
      location_id: Number(location.id),
    },
    fetchPolicy: 'no-cache',
  });

  useEffect(() => {
    return () => {
      if (identifier) dispatch(removeIdentifier());
    };
  }, [identifier]);

  useEffect(() => {
    if (error) {
      setIsShowError(true);
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      setShowEmptyContentDonate(true);
    }
  }, [data]);

  const handleCloseContentOfDonate = useCallback(() => {
    dispatch(removeIdentifier());
    setShowEmptyContentDonate(false);
  }, [dispatch]);

  const showContentOfDonate = useCallback(() => {
    setShowEmptyContentDonate(true);
  }, []);

  return (
    <>
      <section>
        <WrapperInfo>
          <TitleInfo>
            Are you planning to donate something to the library?
          </TitleInfo>
          <SubTitle>
            Fill in the required* fields or try to scan the code
          </SubTitle>
          {showEmptyContentDonate && (
            <BackSpan onClick={handleCloseContentOfDonate}>
              <ArrowIcon /> Back
            </BackSpan>
          )}
        </WrapperInfo>
        {loading ? (
          <WrapperLoader>
            <Oval
              ariaLabel="loading-indicator"
              height={100}
              width={100}
              strokeWidth={5}
              strokeWidthSecondary={1}
              color="blue"
              secondaryColor="white"
            />
          </WrapperLoader>
        ) : (
          !showEmptyContentDonate && <DonateViaISBN />
        )}
        {data && showEmptyContentDonate && (
          <DonateBook data={data} onHideContent={handleCloseContentOfDonate} />
        )}
        {!data && showEmptyContentDonate && (
          <DonateBook onHideContent={handleCloseContentOfDonate} />
        )}
      </section>
      <Modal active={isShowError} setActive={setIsShowError}>
        <ErrorMessage
          setActive={setIsShowError}
          message="We did not find a suitable book code :(
          But you can still donate to the library by filling in the information manually"
          title="ISBN is not known"
          titleCancel="Ok"
          activeAskManager={false}
          showContentOfDonate={showContentOfDonate}
        />
      </Modal>
    </>
  );
};

export default DonateBookFlow;